pipeline {
  agent any

  environment {
    REGISTRY = "docker.io"
    REPO = "jinesh14/spe-project-fe"
    DOCKER_IMAGE_TAG = ""
    IMAGE = ""
    DOCKERHUB_CRED_ID="dockerhub"
  }

  stages {

    stage('Prepare Metadata') {
      steps {
        script {
          DOCKER_IMAGE_TAG = sh(script: "echo ${GIT_COMMIT} | cut -c1-7", returnStdout: true).trim()
          IMAGE = "${REGISTRY}/${REPO}:${DOCKER_IMAGE_TAG}"

          env.GIT_COMMIT_SHORT = DOCKER_IMAGE_TAG
          env.GIT_AUTHOR = sh(script: "git --no-pager show -s --format='%an'", returnStdout: true).trim()
          env.GIT_COMMIT_MSG = sh(script: "git --no-pager show -s --format='%s'", returnStdout: true).trim()
        }
      }
    }

    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build & Push Docker Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CRED_ID,
                                          usernameVariable: 'DOCKERHUB_USER',
                                          passwordVariable: 'DOCKERHUB_PASS')]) {
          sh """
            echo "${DOCKERHUB_PASS}" | docker login -u "${DOCKERHUB_USER}" --password-stdin
            docker build -t ${IMAGE} .
            docker push ${IMAGE}
          """
        }
      }
    }

    // stage('Deploy to K8s') {
    //   steps {
    //     sh """
    //       kubectl -n dev set image deployment/frontend frontend=${IMAGE}
    //     """
    //   }
    // }
  }

  post {

    always {
      echo "Frontend pipeline completed."
    }

    success {
      emailext(
        subject: "SUCCESS: Frontend Deployment #${env.BUILD_NUMBER}",
        body: """
          <h2>Frontend Build Successful 🎉</h2>
          <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
          <p><b>Commit:</b> ${env.GIT_COMMIT_SHORT}</p>
          <p><b>Author:</b> ${env.GIT_AUTHOR}</p>
          <p><b>Message:</b> ${env.GIT_COMMIT_MSG}</p>
          <p><b>Docker Image:</b> ${IMAGE}</p>
        """,
        mimeType: 'text/html',
        to: "jineshnisarg@gmail.com"
      )
    }

    failure {
      emailext(
        subject: "FAILURE: Frontend Deployment #${env.BUILD_NUMBER}",
        body: """
          <h2>Frontend Build Failed 💥</h2>
          <p><b>Build URL:</b> <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>
          <p><b>Commit:</b> ${env.GIT_COMMIT_SHORT}</p>
          <p><b>Author:</b> ${env.GIT_AUTHOR}</p>
          <p><b>Message:</b> ${env.GIT_COMMIT_MSG}</p>
        """,
        mimeType: 'text/html',
        to: "jineshnisarg@gmail.com"
      )
    }
  }
}
