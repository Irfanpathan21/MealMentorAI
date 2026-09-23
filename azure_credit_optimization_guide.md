# MealMentor AI: Azure Credit Optimization Guide (Fitting within $200 Credits)

If you are using the Azure Free Trial or Azure for Students ($100/$200 credit limits), you can easily host and run this entire system. Because this is a college project and won't be used 24/7, you can structure your services to consume **less than $15/month** of your credits.

---

## 1. Budget-Optimized Azure Architecture

By provisioning the resources using these exact settings, you ensure your credit usage remains extremely low:

| Azure Resource | Recommended Tier & Configuration | Estimated Monthly Credit Burn |
| :--- | :--- | :--- |
| **Azure OpenAI (GPT-4o)** | Pay-as-you-go (Standard Tier S0) | **<$1.00** (You only pay per token/prompt; a few hundred tests will cost pennies) |
| **Azure App Service (Backend)** | **F1 Free Plan** (Linux) | **$0.00 / Free** (Provides 60 CPU minutes/day and 1GB RAM) |
| **Azure Blob Storage** | Hot Tier, Locally Redundant (LRS) | **<$0.05** (Storing 100MB of food photos is virtually free) |
| **Azure PostgreSQL Server** | **Burstable B1ms** (1 vCPU, 2GB RAM, 32GB storage) | **~$13.00** (Full cost if left running 24/7. **<$4.00** if paused when not coding) |
| **Estimated Total Burn** | | **~$14.05 / month** (Without pausing DB)<br>**~$5.00 / month** (With DB pausing) |

---

## 2. Essential Configuration Steps to Save Credits

### Step 2.1: Host Backend on the F1 Free App Service Plan
When deploying your Node.js backend to Azure App Service:
1. In the **Create Web App** wizard, go to the **Pricing Plan** section.
2. Under **Pricing plan**, click **Explore pricing plans**.
3. Select the **Dev / Test** tab.
4. Select the **F1 (Free)** spec (1 GB memory, 60 minutes/day compute).
5. This hosts your Express API completely free.

---

### Step 2.2: Set Up Burstable B1ms PostgreSQL (Cheapest Database Option)
When provisioning your PostgreSQL database:
1. In the **Compute + storage** section of the creation screen, click **Configure server**.
2. Select **Burstable** under Compute Tier.
3. Select **Standard_B1ms** (1 vCPU, 2 GiB RAM).
4. Set the **Storage size** slider to **32 GiB** (do not select 128GB or higher, as storage costs are billed continuously even if the server is stopped).
5. Turn **OFF** "Auto-grow storage" and "High availability".
6. Turn **OFF** "Geo-redundant backups".

---

### Step 2.3: Pause Your Database Compute to Stop Charges
The PostgreSQL database is the only resource that incurs a continuous hourly compute charge while running. When you are not coding or presenting your project, you can **Stop** the server to save about 70% of its cost:

1. Open your PostgreSQL Flexible Server resource in the Azure Portal.
2. On the **Overview** dashboard page, click the **Stop** button in the top menu.
3. While stopped, Azure **completely pauses compute charges**. You will only be billed for the 32GB disk storage (~$0.11/day).
4. When you are ready to write code, test the app, or demo it to your professor, go back to the dashboard and click **Start**.

*Note: Azure PostgreSQL servers automatically restart after 7 days if left stopped, so remember to re-stop it if your project goes idle for weeks.*

---

## 3. Setting Up a Billing Alert (Safety Net)

Set up a budget alarm that will notify you immediately if you exceed a certain threshold (e.g., $10 credit burn).

1. In the Azure Portal search bar, type **Cost Management + Billing** and select it.
2. In the left sidebar, click **Budgets**.
3. Click **+ Add**.
4. Configure the budget:
    *   **Name**: `ProjectBudgetAlert`
    *   **Reset period**: Monthly
    *   **Amount**: `15` (triggers when monthly charge approaches $15)
5. Click **Next** to configure alerts.
6. Set an **Alert condition**:
    *   **Type**: Actual
    *   **% of budget**: `80` (sends email when you reach $12 spend)
    *   **Email address**: Enter your personal email.
7. Click **Create**.
