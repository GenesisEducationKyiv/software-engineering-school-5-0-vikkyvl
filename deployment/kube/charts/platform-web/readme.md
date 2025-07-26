Локально (KIND):
```bash
helm uninstall platform-web --kube-context docker-desktop
sleep 30
helm install platform-web ./ -f values-local.yaml --kube-context docker-desktop
```
```bash
helm upgrade platform-web ./ -f values-local.yaml -n platform-web --kube-context docker-desktop
```
```bash
helm template platform-web ./  -f values-local.yaml -n platform-web --kube-context docker-desktop > rendered.yaml
```

Production (AWS EKS):
```bash
kubectl apply -f templates/platform-web-application.yaml
```
```bash
helm install platform-web ./charts/platform-web -f charts/platform-web/values-prod.yaml \
  --kube-context arn:aws:eks:us-east-1:301235908824:cluster/ragdoll-eks
```
