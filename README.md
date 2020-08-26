# deno_server
A server that returns config file by composing environment (cookie) and device (path_param) files.

# Table of contents
- [Deno stuff](#deno-stuff)
  * [Install deno](#install-deno)
  * [Install denon to redeploy automatically](#install-denon-to-redeploy-automatically)
  * [Add deno to path](#add-deno-to-path)
  * [Configure VSCode intstall these extensions](#configure-vscode-intstall-these-extensions)
  * [Run server](#run-server)
  * [Test server](#test-server)
- [Docker stuff](#docker-stuff)
  * [Make your docker image](#make-your-docker-image)
  * [View your docker images](#view-your-docker-images)
  * [Run your docker image in a container with log level DEBUG passing a enviroment variable](#run-your-docker-image-in-a-container-with-log-level-debug-passing-a-enviroment-variable)
  * [View your docker containers](#view-your-docker-containers)
  * [Remove your old docker images and containers not used](#remove-your-old-docker-images-and-containers-not-used)
- [Heroku stuff](#heroku-stuff)
  * [Login](#login)
  * [Create docker image and deploy it](#create-docker-image-and-deploy-it)
  * [View logs](#view-logs)
- [Kubernetes stuff](#kubernetes-stuff)
  * [Local Registry Server](#local-registry-server)
    + [Create a local registry server and push the deno-server image](#create-a-local-registry-server-and-push-the-deno-server-image)
    + [Delete a local registry server](#delete-a-local-registry-server)
  * [Pods](#pods)
    + [Create a kubernetes pod with a container with a local deno-server image](#create-a-kubernetes-pod-with-a-container-with-a-local-deno-server-image)
    + [Create a kubernetes pod with a container with a deno-server image in a local registry server through a yaml file](#create-a-kubernetes-pod-with-a-container-with-a-deno-server-image-in-a-local-registry-server-through-a-yaml-file)
    + [View kubernetes pods](#view-kubernetes-pods)
    + [View a kubernetes pod status](#view-a-kubernetes-pod-status)
    + [Delete a kubernetes pod](#delete-a-kubernetes-pod)
  * [Logs](#logs)
    + [View logs by pod](#view-logs-by-pod)
    + [View logs by tag app](#view-logs-by-tag-app)
  * [Services](#services)
    + [Expose a kubernetes pod in a service so port forward is not needed](#expose-a-kubernetes-pod-in-a-service-so-port-forward-is-not-needed)
    + [View a kubernetes service to see the nodePort where you can access the server](#view-a-kubernetes-service-to-see-the-nodeport-where-you-can-access-the-server)
    + [Delete a kubernetes service](#delete-a-kubernetes-service)
  * [ReplicaSets](#replicasets)
    + [Create a kubernetes replicaSet with a service through a yaml file](#create-a-kubernetes-replicaset-with-a-service-through-a-yaml-file)
    + [View a kubernetes deployment to see the nodePort where you can access the server](#view-a-kubernetes-deployment-to-see-the-nodeport-where-you-can-access-the-server)
    + [Delete a kubernetes replicaset and service](#delete-a-kubernetes-replicaset-and-service)
  * [Deployments](#deployments)
    + [Create a kubernetes deployment with a service through a yaml file](#create-a-kubernetes-deployment-with-a-service-through-a-yaml-file)
    + [View a kubernetes deployment to see the nodePort where you can access the server](#view-a-kubernetes-deployment-to-see-the-nodeport-where-you-can-access-the-server-1)
    + [Delete kubernetes deployment and service and configMap](#delete-kubernetes-deployment-and-service-and-configmap)
    + [Delete kubernetes deployment and service and configMap all together with a label](#delete-kubernetes-deployment-and-service-and-configmap-all-together-with-a-label)

# Deno stuff
## Install deno
```
brew install deno
deno upgrade --version 1.2.0
```

## Install denon to redeploy automatically
```
deno install --allow-read --allow-run --allow-write --allow-net -f --unstable https://deno.land/x/denon/denon.ts
```

## Add deno to path
```
vi $HOME/.bash_profile
export PATH="/Users/cu47ek/.deno/bin:$PATH"
```

## Configure VSCode intstall these extensions
* Deno
* REST Client (optional)

## Run server
```
denon run --allow-env --allow-read --allow-net --unstable server.ts debug
```
Ctrl-c to kill the server

## Test server
```
deno test -A --unstable
```
Ctrl-c to kill the server

# Docker stuff
## Make your docker image
```
docker build -t deno-server .
```

## View your docker images
```
docker images
```

## Run your docker image in a container with log level DEBUG passing a enviroment variable
```
docker run --name deno-server --rm --init -p 8080:8080 -e "LOG_LEVEL=DEBUG" deno-server
ctrl-c to close
```

## View your docker containers
```
docker ps -a
```

## Remove your old docker images and containers not used
```
docker system prune
```

# Heroku stuff
## Login
```
heroku login
heroku container:login
```

## Create docker image and deploy it
```
heroku container:push web -a denosrv
heroku container:release web -a denosrv
```

## View logs
```
heroku logs --tail -a denosrv
```

# Kubernetes stuff
## Local Registry Server
### Create a local registry server and push the deno-server image
```
docker run -d -p 5000:5000 --name registry registry:2
docker image tag deno-server localhost:5000/deno-server
docker push localhost:5000/deno-server
```

### Delete a local registry server
```
docker container stop registry && docker container rm -v registry
```

## Pods
### Create a kubernetes pod with a container with a local deno-server image
```
kubectl run deno-server --generator=run-pod/v1 --image=deno-server
```

### Create a kubernetes pod with a container with a deno-server image in a local registry server through a yaml file
```
cd kubernetes
kubectl apply -f server-pod.yaml
kubectl port-forward deno-server 8080:8080   (Service isn't needed)
```

### View kubernetes pods
```
kubectl get pods
```

### View a kubernetes pod status
```
kubectl describe pod deno-server
```

### Delete a kubernetes pod
```
kubectl delete pod deno-server
```

## Logs
### View logs by pod
```
kubectl logs -f deno-server
```

### View logs by tag app
```
kubectl logs -f -lapp=deno-server --all-containers=true
```

## Services
### Expose a kubernetes pod in a service so port forward is not needed
```
kubectl expose pod deno-server --type LoadBalancer --port=8080 --target-port=8080
```

### View a kubernetes service to see the nodePort where you can access the server
```
kubectl get service
```

### Delete a kubernetes service
```
kubectl delete service deno-server
```

## ReplicaSets
### Create a kubernetes replicaSet with a service through a yaml file
```
kubectl apply -f server-replicaset.yaml
```

### View a kubernetes deployment to see the nodePort where you can access the server
```
kubectl get replicaset
```

### Delete a kubernetes replicaset and service
```
kubectl delete service deno-server-service
kubectl delete replicaset deno-server-replicaset
```

## Deployments
### Create a kubernetes deployment with a service through a yaml file
```
kubectl apply -f server-deployment.yaml
```

### View a kubernetes deployment to see the nodePort where you can access the server
```
kubectl get deployment
```

### View all the stuff form the kubernetes deployment 
```
kubectl get cm,svc,deploy,rs,po,ep -lapp=deno-server
```

### Delete kubernetes deployment and service and configMap
```
kubectl delete configmap deno-server-configmap
kubectl delete service deno-server-service
kubectl delete deployment deno-server-deployment
```

### Delete kubernetes deployment and service and configMap all together with a label
```
kubectl delete deploy,svc,cm -lapp=deno-server
```
