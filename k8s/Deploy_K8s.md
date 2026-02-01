# How to Deploy to Kubernetes (k8s)

This guide provides instructions for running your Docker-ready project on a Kubernetes cluster such as **Minikube** or **Docker Desktop Kubernetes**.

---

## 1. Prerequisites

Make sure the following are set up on your system:

* `kubectl` is installed
* A Kubernetes cluster is running:

  * Enable **Kubernetes** in Docker Desktop **OR**
  * Start Minikube:

    ```bash
    minikube start
    ```

---

## 2. Configuration (`config.yaml`)

Before deploying, review the configuration file:

```
k8s/config.yaml
```

This file contains all required **environment variables**.

### ⚠️ Important Notes

* If your application uses **email passwords, API keys, or other secrets**, update them before applying the config
* **Recommended:** Use **Kubernetes Secrets** instead of plain text values
* The current configuration uses:

  * Dummy/default values
  * `localhost` for the database (this is correct for the monolith image)

---

## 3. Deployment Steps

Apply all Kubernetes configuration files (ConfigMap, Deployment, and Service):

```bash
kubectl apply -f k8s/
```

This command will create the following resources:

### Kubernetes Resources Created

* **ConfigMap**: `nagar-sewak-config`

  * Sets up environment variables

* **Deployment**: `nagar-sewak-deployment`

  * Pulls the image:

    ```
    rishabhrai12/nagar-sewak-monolith:latest
    ```
  * Runs **1 replica** of the application

* **Service**: `nagar-sewak-service`

  * Exposes the application using **NodePort**

---

## 4. Verification

Check if the pod is running:

```bash
kubectl get pods
```

Check the service status:

```bash
kubectl get services
```

Make sure the pod status is `Running` and the service shows assigned NodePorts.

---

## 5. Accessing the App

### Docker Desktop (Mac / Windows)

You can access the application directly via `localhost`:

* **Frontend**:

  ```
  http://localhost:30000
  ```
* **Backend**:

  ```
  http://localhost:30080
  ```

---

### Minikube

First, get the Minikube IP address:

```bash
minikube ip
```

Then access the application using that IP:

* **Frontend**:

  ```
  http://<MINIKUBE-IP>:30000
  ```
