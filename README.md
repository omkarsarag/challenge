# Devops Coding Challenge

### Infrastructure Provisioning (Terraform)

* Provisioned EKS using `terraform-aws-modules/eks/aws`
* Created VPC using `terraform-aws-modules/vpc/aws`
* Enabled public/private access for API server
* Set `enable_cluster_creator_admin_permissions = true` to fix kubectl access

#### Commands:

```bash
terraform init
terraform plan
terraform apply --auto-approve
```

### Docker Image Build & Push (CORS Proxy)

####  Commands:

```bash
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <ecr-url>
docker buildx build --platform linux/amd64 -t <ecr-url>/cors-anywhere:latest --push .
```

### Kubernetes Deployment

* Applied `deployment.yaml` + `service.yaml` 
#### Commands:

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### Autoscaling with HPA
* Applied `HorizontalPodAutoscaler.yaml`
#### Working Patch:

```bash
kubectl apply -f HorizontalPodAutoscaler.yaml
Kubectl apply -f  https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
kubectl patch deployment metrics-server -n kube-system --type=json  -p='[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
```
### CORS Proxy Testing

```bash
curl -H "Origin: http://example.com" \
     "http://<ELB>/https://httpbin.org/get"

curl -i -H "Origin: http://example.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     "http://<ELB>/https://httpbin.org/get"
```

### Load Testing with `k6`

* Created `cors-load-test.js` to simulate 1000 RPS

```bash
k6 run --no-connection-reuse cors-load-test.js
kubectl get hpa -w
```

* Observations:

    * Autoscaling from 6 → 15 pods
    * No failures or restarts
    * Sustained 1000 RPS with low failure rate

