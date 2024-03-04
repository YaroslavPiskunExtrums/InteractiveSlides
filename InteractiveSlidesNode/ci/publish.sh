#!/bin/sh

set -e

DIR="$( cd "$( dirname "$0" )" && pwd )"

if [ -z "$IMAGE" ]; then
    echo "IMAGE must be set"
    exit 1
fi

if [ -z "$VERSION" ]; then
    echo "VERSION must be set"
    exit 2
fi

if [ -z "$REPO_REGION" ]; then
    echo "REPO_REGION must be set"
    exit 3
fi

if [ -z "$PROJECT_ID" ]; then
    echo "PROJECT_ID must be set"
    exit 4
fi

echo "Building and deploying docker image, version: $VERSION";

export GCR_NAME=${REPO_REGION}/${PROJECT_ID}/${IMAGE}
export TAG=${GCR_NAME}:v${VERSION:0:6}

echo " • Building: ${TAG}"
cd $DIR/..
ls -la

DOCKERFILE=${DOCKERFILE:-Dockerfile}

docker build -f $DOCKERFILE -t $TAG .
cd -

echo " • Deploying tag: ${TAG}"

docker push $TAG

echo "export TAG=$TAG" > docker-tag.env
