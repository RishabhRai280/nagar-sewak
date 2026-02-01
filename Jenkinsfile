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
                    args '-v /root/.m2:/root/.m2'
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
                        def appImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}", "-f Dockerfile.merged .")
                        
                        appImage.push()
                        
                        appImage.push("latest")
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    sh "sed -i 's|${IMAGE_NAME}:.*|${IMAGE_NAME}:${BUILD_NUMBER}|' k8s/deployment.yaml"
                    
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                         sh 'kubectl apply -f k8s/'
                         sh "kubectl rollout status deployment/nagar-sewak -n ${KUBE_NAMESPACE}"
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
