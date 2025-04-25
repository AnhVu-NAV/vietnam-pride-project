pipeline {
    agent any

    stages {
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t vietnam-pride-project .'
            }
        }

        stage('Deploy Docker Container') {
            steps {
                sh '''
                    docker stop vietnam-pride || true
                    docker rm vietnam-pride || true
                    docker run -d --name vietnam-pride -p 80:80 vietnam-pride-project
                '''
            }
        }
    }
}
