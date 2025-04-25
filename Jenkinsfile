pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('vietnam-pride-project')
                }
            }
        }

        stage('Deploy Docker Container') {
            steps {
                script {
                    sh 'docker stop vietnam-pride || true'
                    sh 'docker rm vietnam-pride || true'
                    sh 'docker run -d --name vietnam-pride -p 80:80 vietnam-pride-project'
                }
            }
        }
    }
}
