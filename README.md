# Diedrich Quick Contact Button

Diedrich Quick Contact Button IoT 1-Click Service

## Architecture

![Architecture](resources/architecture.png)

## 1. Claim button

At first, we must claim buttons in AWS IoT 1-Click console.
Enter the device ID in the AWS IoT 1-Click mobile app or console to configure Wi-Fi and to claim the device. (Use device ID prefix: G030PM)

Note:
AWS IoT Enterprise Button is only available us-west-2 region (Orgeon)
AWS IoT 1-Click does not support AWS IoT buttons whose device serial numbers (DSN) begin with G030JF, G030MD, and G030PT.

## 2. Register button API Endpoint

  - **Gateway Info**

| Stage | Service Endpoint                                           | API Key                                  |
| ----- | ---------------------------------------------------------- | ---------------------------------------- |
| dev   | https://q3o7m129y4.execute-api.us-west-2.amazonaws.com/dev | VA1u7eCAKdaFiYd1TpQkI3vdzkqRFeMyaLtzXd1I |

<br/>

  - **Specification For Endpoint**
  
| Endpoint | Method | Path      | Auth Mode         | Description                      |
| -------- | ------ | --------- | ----------------- | -------------------------------- |
| register | POST   | /register | Private (API Key) | register a button in IoT 1-Click |

<br/>

- **Parameter requirements**

| Parameters | Description               |
| ---------- | ------------------------- |
| dsn        | DSN of button to register |
| username   | Salesforce username       |
| email      | owner email               |
| phone      | owner phone number        |

<br/>