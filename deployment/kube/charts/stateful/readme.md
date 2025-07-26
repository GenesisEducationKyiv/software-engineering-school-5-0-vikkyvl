Локально (KIND, Kubernetes Secret, registry увімкнено):
```bash
helm uninstall stateful --kube-context docker-desktop
helm install stateful ./ -f values-local.yaml --kube-context docker-desktop
```
Production (AWS EKS, AWS Secrets Manager, registry вимкнено):
```bash
helm repo add secrets-store-csi-driver https://kubernetes-sigs.github.io/secrets-store-csi-driver/charts
helm repo add aws-secrets-manager https://aws.github.io/secrets-store-csi-driver-provider-aws
helm repo update

aws eks create-addon \
  --cluster-name ragdoll-eks \
  --addon-name aws-ebs-csi-driver \
  --service-account-role-arn arn:aws:iam::301235908824:role/ragdoll-ebs-csi-role \
  --region us-east-1
  
# 1. Main CSI Driver via Helm
helm install secrets-store-csi-driver secrets-store-csi-driver/secrets-store-csi-driver \
  --namespace kube-system \
  --create-namespace \
  --set syncSecret.enabled=true \
  --set enableSecretRotation=true

# 2. AWS Provider directly via kubectl
kubectl apply -f https://raw.githubusercontent.com/aws/secrets-store-csi-driver-provider-aws/main/deployment/aws-provider-installer.yaml
  
helm uninstall stateful --kube-context arn:aws:eks:us-east-1:301235908824:cluster/ragdoll-eks
helm upgrade stateful ./ -f values-prod.yaml --kube-context arn:aws:eks:us-east-1:301235908824:cluster/ragdoll-eks
helm install stateful ./ -f values-prod.yaml --kube-context arn:aws:eks:us-east-1:301235908824:cluster/ragdoll-eks
```

## Troubleshooting: TODO: clean up
```bash
helm uninstall secrets-provider-aws -n kube-system
kubectl delete sa secrets-store-csi-driver -n kube-system --ignore-not-found
kubectl delete clusterrole secrets-store-csi-driver --ignore-not-found
kubectl delete clusterrolebinding secrets-store-csi-driver --ignore-not-found
kubectl delete daemonset secrets-store-csi-driver -n kube-system --ignore-not-found

helm upgrade --install secrets-store-csi-driver secrets-store-csi-driver/secrets-store-csi-driver \
--namespace kube-system \
--set syncSecret.enabled=true \
--set enableSecretRotation=true
```
```bash
helm uninstall secrets-store-csi-driver -n kube-system
helm uninstall secrets-provider-aws -n kube-system || true

helm upgrade --install secrets-store-csi-driver secrets-store-csi-driver/secrets-store-csi-driver \
  --namespace kube-system \
  --set syncSecret.enabled=true \
  --set enableSecretRotation=true \
  --set "linux.providers[0].name"="aws"
```



