Локально (KIND):
```bash
helm uninstall platform --kube-context docker-desktop
sleep 30
helm install platform ./ -f values-local.yaml --kube-context docker-desktop
```
```bash
helm uninstall platform --kube-context docker-desktop
```
```bash
helm install platform ./ -f values-local.yaml --kube-context docker-desktop
```

```bash
helm upgrade platform ./ -f values-local.yaml -n ragdoll --kube-context docker-desktop
```
```bash
helm template platform ./  -f values-local.yaml -n ragdoll --kube-context docker-desktop > rendered.yaml
```


Production (AWS EKS):
```bash
kubectl apply -f templates/platform-application.yaml
```
```bash
helm install platform ./ -f values-prod.yaml \
  --kube-context arn:aws:eks:us-east-1:301235908824:cluster/ragdoll-eks
```
