# deno_server
A server that returns config file by composing environment (cookie) and device (path_param) files.

## Install deno:
```
brew install deno
deno upgrade --version 1.2.0
```

## Install denon (to redeploy automatically):
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

## Run server:
```
denon run -A --unstable server.ts debug
```
Ctrl-c to kill the server

## Test server:
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

## Run your docker image in a container with log level DEBUG passing a enviroment variable (Can be closed with ctrl-c)
```
docker run --name deno-server --rm --init -p 8080:8080 -e "LOG_LEVEL=DEBUG" deno-server
```

## View your docker containers
```
docker ps -a
```

## Remove your old docker images and containers not used
```
docker system prune
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

### Create a kubernetes pod with a container with a deno-server image in a local registry server (needed to be created) through a yaml file (server-pod.yaml)
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
### Create a kubernetes deployment with a service through a yaml file (server-deployment.yaml)
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
### Create a kubernetes deployment with a service through a yaml file (server-deployment.yaml)
```
kubectl apply -f server-deployment.yaml
```

### View a kubernetes deployment to see the nodePort where you can access the server
```
kubectl get deployment
```

### Delete a kubernetes deployment, service and configMap
```
kubectl delete service deno-server-service
kubectl delete deployment deno-server-deployment
kubectl delete configmap deno-server-configmap
```

### Delete a kubernetes deployment, service and configMap all together with a label
```
kubectl delete service,deployment,configmap -lapp=deno-server
```
