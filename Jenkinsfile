pipeline {
    agent any

    environment {
        DOCKER_CREDS_ID = 'DockerHub'
        IMAGE_NAME = 'rishabhrai12/nagar-sewak-monolith'
        KUBE_NAMESPACE = 'default'
    }

    stages {
        stage('Test Backend') {
            agent {
                docker {
                    image 'maven:3.9-eclipse-temurin-21-alpine'
                }
            }
            steps {
                dir('backend') {
                    sh 'mvn clean test'
                }
            }
        }

        stage('Test Frontend') {
            agent {
                docker {
                    image 'node:20-alpine'
                    args '--entrypoint=""'
                }
            }
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build' 
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_CREDS_ID}") {
                        // Build only the latest tag as requested
                        def appImage = docker.build("${IMAGE_NAME}:latest", "-f Dockerfile.merged .")
                        appImage.push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Removed sed command to avoid OS compatibility issues
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                         sh 'kubectl apply -f k8s/'
                         // Force restart to pull the new 'latest' image
                         sh "kubectl rollout restart deployment/nagar-sewak-deployment -n ${KUBE_NAMESPACE}"
                         sh "kubectl rollout status deployment/nagar-sewak-deployment -n ${KUBE_NAMESPACE}"
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
