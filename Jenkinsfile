pipeline {
    agent any
    environment {
        INVENTORY_PATH="/jenkins_inventory"
        RUN_PATH="/jenkins/ansible"
        FRONTEND_VERSION = sh(returnStdout: true, script: "cat package.json | grep version | head -1 | awk -F: '{ print \$2 }' | awk -F- '{ print \$1\"-\"\$2 }' | sed 's/[\",]//g'").trim()
        REPOSITORY="git.newvisiondata.com/virtual-locker/virtual-locker-frontend.git"
        ZEBRA_REPOSITORY="github.com/zebratechnologies/virtual-locker-frontend.git"
    }
    stages {
        stage('Build') {
            when { not { branch 'master'}}
            steps {
                withCredentials([usernamePassword(credentialsId: 'gitlab_repository_virtual_locker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh '''
                        #!/bin/bash
                        echo "NEW JENKINSFILE"
                        echo ${USERNAME} 
                        echo ${PASSWORD}
                        echo $USERNAME
                        echo $PASSWORD
                        echo $REPOSITORY
                        echo "TODO LO DE ZEBRA"
                        echo $ZEBRA_REPOSITORY
                        echo $ZEBRA_USERNAME
                        echo $ZEBRA_PASSWORD
                        echo $VL_REGISTRY
                        
                    '''
                    withCredentials([usernamePassword(credentialsId: 'github_zebra_repository_virtual_locker', usernameVariable: 'ZEBRA_USERNAME', passwordVariable: 'ZEBRA_PASSWORD')]) {
                    sh '''
                      #!/bin/bash
                      echo "APARTADO CREDENCIALES ZEBRA"
                      echo $ZEBRA_REPOSITORY
                      echo $ZEBRA_USERNAME
                      echo $ZEBRA_PASSWORD
                      echo "-------------"
                      echo $USERNAME
                      echo $PASSWORD
                      echo $VL_REGISTRY
                    '''
                    }
                }
            }
        }
        stage("Deploy"){
            when { not { branch 'master'}}
            steps{
                sh  '''
                        #!/bin/bash
                        echo "Deploy STAGE VICO"
                        ${BRANCH_NAME}       
                    '''
            }
        }
        stage("Push Zebra") {
            when { anyOf { branch 'master'; } }
            steps{
              withCredentials([usernamePassword(credentialsId: 'gitlab_repository_virtual_locker', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                sh '''
                #!/bin/bash
                chmod +x settings/push-script.sh
                settings/./push-script.sh -u $USERNAME -p "$PASSWORD" -v "$FRONTEND_VERSION" -b $BRANCH_NAME -r $REPOSITORY -c false
                docker login $VL_REGISTRY -u ${USERNAME} -p ${PASSWORD}
                docker build --target frontend-application-build -t frontend-application-build .
                docker build -t $VL_REGISTRY/virtual-locker/virtual-locker-frontend .
                docker push $VL_REGISTRY/virtual-locker/virtual-locker-frontend
                docker rmi -f $VL_REGISTRY/virtual-locker/virtual-locker-frontend
                '''
                withCredentials([usernamePassword(credentialsId: 'github_zebra_repository_virtual_locker', usernameVariable: 'ZEBRA_USERNAME', passwordVariable: 'ZEBRA_PASSWORD')]) {
                  sh '''
                  #!/bin/bash
                  chmod +x settings/push-script.sh
                  settings/./push-script.sh -u $USERNAME -p "$PASSWORD" -v "$FRONTEND_VERSION" -b $BRANCH_NAME -r $REPOSITORY -c true -s $ZEBRA_REPOSITORY -q $ZEBRA_USERNAME -t $ZEBRA_PASSWORD
                  '''
                }
              }

            }
        }
    }
}
