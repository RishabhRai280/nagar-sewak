# Kubernetes (k8s) Deployment Guide ☸️

This guide details how to deploy **NagarSewak** to a Kubernetes cluster. It assumes you are using the pre-built **Monolith** image from Docker Hub, which contains the Frontend, Backend, and Database in a single container.

---

## 1. Prerequisites

Before you begin, ensure you have:

*   **kubectl** installed on your machine.
*   A running Kubernetes cluster. Common options:
    *   **Docker Desktop**: Enable Kubernetes in settings.
    *   **Minikube**: Run `minikube start`.
    *   **Cloud Provider**: EKS, GKE, or AKS.

---

## 2. Cluster Configuration

### Manifest Files
All Kubernetes manifests are located in the `k8s/` directory:

1.  **`config.yaml`**: Contains `ConfigMap` with environment variables.
2.  **`deployment.yaml`**: Defines the `Deployment` ensuring 1 replica of the app runs.
3.  **`service.yaml`**: Defines the `Service` to expose ports via NodePort.

### Verify Configuration
Check `k8s/config.yaml` to ensure environment variables are correct.
*   **Database**: Defaults to `localhost` (internal to the pod).
*   **Email**: Defaults to dummy values. Update `EMAIL_USER` and `EMAIL_PASS` if you need working emails.

---

## 3. Deploying the Application

Run the following command from the project root to apply all manifests:

```bash
kubectl apply -f k8s/
```

Expected output:
```text
configmap/nagar-sewak-config created
deployment.apps/nagar-sewak-deployment created
service/nagar-sewak-service created
```

---

## 4. Checking Status

Monitor the deployment status:

```bash
kubectl get pods
```
Wait until the **STATUS** is `Running`.

Check the services to see the exposed ports:

```bash
kubectl get services
```

---

## 5. Accessing the Application

The service uses **NodePort** to expose the application.

### Docker Desktop (Mac/Windows)
Docker Desktop binds NodePorts to `localhost`.
*   **Frontend**: [http://localhost:30000](http://localhost:30000)
*   **Backend API**: [http://localhost:30080](http://localhost:30080)

### Minikube
Minikube runs in a VM, so you need its IP address.

1.  Get the IP:
    ```bash
    minikube ip
    ```
2.  Access in browser:
    *   **Frontend**: `http://<MINIKUBE-IP>:30000`
    *   **Backend**: `http://<MINIKUBE-IP>:30080`

---

## 6. Troubleshooting

**Pod is crashing / Error state?**
Check the logs:
```bash
kubectl logs deployment/nagar-sewak-deployment
```

**Database connection failed?**
Since we are using the Monolith image, the database is inside the container. Ensure `SPRING_DATASOURCE_URL` in `config.yaml` points to `localhost`.

**Updating the App?**
If you push a new image to Docker Hub, restart the rollout:
```bash
kubectl rollout restart deployment/nagar-sewak-deployment
```
