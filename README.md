# gke-mongodb-app

* let's create the necessary secrets in Google Secret Manager. Run the following commands in your terminal: 

```
gcloud secrets create mongodb-username --replication-policy="automatic"
gcloud secrets create mongodb-password --replication-policy="automatic"
gcloud secrets create mongodb-cluster-url --replication-policy="automatic"
gcloud secrets create mongodb-database-name --replication-policy="automatic"
```

* Set the values for the created secrets:

```
echo "your-mongodb-username" | gcloud secrets versions add mongodb-username --data-file=-
echo "your-mongodb-password" | gcloud secrets versions add mongodb-password --data-file=-
echo "your-mongodb-cluster-url" | gcloud secrets versions add mongodb-cluster-url --data-file=-
echo "your-mongodb-database-name" | gcloud secrets versions add mongodb-database-name --data-file=-
```

* Create a Kubernetes secret to store the MongoDB connection details:

```
kubectl create secret generic mongodb-secrets \
  --from-literal=mongo-uri="mongodb+srv://$(gcloud secrets versions access latest --secret=mongodb-username):$(gcloud secrets versions access latest --secret=mongodb-password)@$(gcloud secrets versions access latest --secret=mongodb-cluster-url)/$(gcloud secrets versions access latest --secret=mongodb-database-name)?retryWrites=true&w=majority"
```

* Build a Docker image of your app and push it to Google Container Registry (GCR):

```
gcloud builds submit --tag gcr.io/<your-project-id>/gke-mongodb-app:latest .
```
* Deploy your app on GKE

``` 
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```
