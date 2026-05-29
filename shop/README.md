# 🛍️ Basic Shop

A simple Node.js e-commerce app with Express.

---

## Project Structure

```
shop/
├── public/             # Frontend (HTML, CSS, JS)
├── routes/             # Express API routes
├── data/               # Product data (JSON)
├── terraform/          # AWS infrastructure
├── ansible/            # Server setup & deployment
├── Dockerfile          # Docker image
├── docker-compose.yml  # Local Docker run
└── server.js           # App entry point
```

---

## 🚀 Run Locally

### With Node.js
```bash
npm install
npm start
# → http://localhost:3000
```

### With Docker
```bash
docker build -t shop-app .
docker run -p 3000:3000 shop-app
```

### With Docker Compose
```bash
docker-compose up --build
```

---

## ☁️ Deploy to AWS

### Step 1 — Provision Server with Terraform
```bash
cd terraform/
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your AWS key name

terraform init
terraform plan
terraform apply
```

### Step 2 — Deploy App with Ansible
```bash
cd ansible/
ansible-playbook -i inventory/hosts.ini playbook.yml
# → App running at http://YOUR_SERVER_IP:3000
```

---

## 📦 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/shop.git
git push -u origin main
```

---

## ⚠️ Security Notes

- Never commit `terraform.tfvars` (contains secrets)
- Never commit `.env` files
- Use **GitHub Secrets** for CI/CD pipelines
