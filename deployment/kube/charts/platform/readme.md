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
helm install platform ./charts/platform -f charts/platform/values-prod.yaml \
  --kube-context arn:aws:eks:us-east-1:301235908824:cluster/ragdoll-eks
```