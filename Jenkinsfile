pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t docker-task-app:${BUILD_NUMBER} ./app'
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    docker rm -f docker-task-ci-app || true
                    docker run -d \
                      --name docker-task-ci-app \
                      --restart always \
                      -p 3002:3000 \
                      docker-task-app:${BUILD_NUMBER}
                '''
            }
        }

        stage('Verify Container') {
            steps {
                sh 'sleep 3 && curl --fail http://localhost:3002/health'
            }
        }
    }
}
