pipeline {
    agent any

    environment {
        // Docker Hub Credentials ID (Must be configured in Jenkins)
        DOCKER_CREDS_ID = 'docker-hub-credentials'
        IMAGE_NAME = 'rishabhrai12/nagar-sewak-monolith'
        KUBE_NAMESPACE = 'default'
    }

    stages {
        stage('Test Backend') {
            agent {
                docker {
                    image 'maven:3.9-eclipse-temurin-21-alpine'
                    args '-v /root/.m2:/root/.m2' // Cache maven dependencies
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
                    // Running build as a check since 'test' might not be set up
                    sh 'npm run build' 
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', "${DOCKER_CREDS_ID}") {
                        // Build using the merged Dockerfile
                        def appImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}", "-f Dockerfile.merged .")
                        
                        // Push with build number tag
                        appImage.push()
                        
                        // Push with latest tag
                        appImage.push("latest")
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Update deployment manifest with new image tag (simple replacement)
                    // Note: This requires 'sed' and write permissions
                    sh "sed -i 's|${IMAGE_NAME}:.*|${IMAGE_NAME}:${BUILD_NUMBER}|' k8s/deployment.yaml"
                    
                    // Apply changes
                    // Assumes kubectl is configured on the agent
                    withKubeConfig([credentialsId: 'kubeconfig']) {
                         sh 'kubectl apply -f k8s/'
                         // Wait for rollout
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
