#!/bin/bash
while getopts u:p:v:b:r:c:s:r:t: flag
do
    case "${flag}" in
        u) USERNAME=${OPTARG};;
        p) PASSWORD=${OPTARG};;
        v) FRONTEND_VERSION=${OPTARG};;
        b) BRANCH_NAME=${OPTARG};;
        r) REPOSITORY=${OPTARG};;
        c) CHECK_PUSH=${OPTARG};;
        s) ZEBRA_REPOSITORY=${OPTARG};;
        q) ZEBRA_USER=${OPTARG};;
        t) ZEBRA_PASSWORD=${OPTARG};;
    esac
done
if [[ $CHECK_PUSH == *"false"* ]]
then
  echo "MAKE TAG REPOSITORY"
  git remote set-url origin https://${USERNAME}:${PASSWORD}@$REPOSITORY
  git config --global user.email "${USERNAME}"
  git config --global user.name "${USERNAME}"
  git checkout $BRANCH_NAME
  git pull origin $BRANCH_NAME
  git tag | xargs git tag -d
  git fetch --all
  git fetch --tags
  tag="v"$FRONTEND_VERSION;
  echo "BRANCH :"$BRANCH_NAME" TAG :"$tag
  if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
      echo "Tag found"
      git push origin -d $tag
      git tag -d $tag
      git tag $tag
  else
      echo "Not tag found"
      git tag $tag
  fi
  echo "PUSHING TAG TO REPOSITORY"
  git push origin $tag
else
  echo "PUSH TO ZEBRA REPOSITORY"
  tag="v"$FRONTEND_VERSION;
  git remote set-url origin https://${USERNAME}:${PASSWORD}@$REPOSITORY
  git config --global user.email "${USERNAME}"
  git config --global user.name "${USERNAME}"
  git tag | xargs git tag -d
  git reset --hard
  git fetch --all
  git fetch --tags
  git checkout $BRANCH_NAME
  git pull origin $BRANCH_NAME
  git remote set-url origin https://${ZEBRA_USERNAME}:${ZEBRA_PASSWORD}@$ZEBRA_REPOSITORY
  git checkout $BRANCH_NAME
  git config --global user.email "${ZEBRA_USERNAME}"
  git config --global user.name "${ZEBRA_USERNAME}"
  git pull origin $BRANCH_NAME
  git push origin $BRANCH_NAME
  echo "CHANGES HAVE PUSHED TO ZEBRA REPOSITORY"
  tag="v"$FRONTEND_VERSION;
  echo "BRANCH :"$BRANCH_NAME" TAG :"$tag
  if git rev-parse -q --verify "refs/tags/$tag" >/dev/null; then
      echo "Tag found"
      git push origin -d $tag
      git tag -d $tag
      git tag $tag
  else
      echo "Not tag found"
      git tag $tag
  fi
  echo "TAG HAS PUSHED TO ZEBRA REPOSITORY"
  git push origin $tag
fi
