
# Load Balancer Implementation in TypeScript
This TypeScript load balancer project replicates features seen in popular load balancers like NGINX and HAProxy. It supports multiple load balancing algorithms (Random, Round-Robin, Weighted-Round-Robin) and performs health checks on backend servers. The system includes features for self-healing, retry mechanisms, and webhook alerts for server failures. It's easily configurable through a config.json file for various settings and algorithms.

![Poster](./docs/poster.png)


## Features
- **Easy Configuration**: Manage load balancer settings using a `config.json` file.
- **Load Balancing Algorithms**: Supports Random, Round-Robin, and Weighted-Round-Robin algorithms.
- **Health Checks**: Periodically checks the health of backend servers.
- **Server Management**: Automatically adds and removes backend servers from the healthy server pool.
- **Webhooks**: Sends triggers to a webhook if a backend server goes down. Alerts include:
  - `AllBEServersDown`
  - `BEServerDown`
- **Retries & Redirects**: If a selected server is down, the load balancer retries another healthy server and performs a health check on the failed server.
- **Self-Healing**: Attempts to recover downed backend servers.

## How to Use

By default, the load balancer expects 3 backend servers to be running on ports `8081`, `8082`, and `8083`.

### Running Backend Servers:
```bash
npm run dev:be 8081
```

### Running the Load Balancer:
```bash
npm run dev:lb 8000
```

Now, start sending requests to the load balancer at `localhost:8000`.

## How to Test

1. **Initial Setup:**
   - Follow the instructions to start backend servers and the load balancer.
   - In `config.json`, configure the `send_alert_webhook` to trigger alerts.
   - Use [Typed Webhook](https://typedwebhook.tools/) for a temporary webhook URL.
   
2. **Backend Server Down:**
   - Kill a backend server.
   - Observe the load balancer logs. It will attempt to heal the server and redirect requests to other healthy servers.

3. **All Backend Servers Down:**
   - Kill all backend servers.
   - You will receive an alert on the webhook after `alert_on_all_be_failure_streak` number of failures.

4. **Self-Healing:**
   - The system will attempt to self-heal backend servers with a 50% success rate by default.

5. **Manual Cleanup:**
   - Processes started by self-healing are in a detached state and must be manually terminated.

## Configuration

The project uses a `config.json` file for configuration:

```json
{
  "lbPORT": 8000,
  "_lbAlgo": "rr",
  "be_servers": [
    { "domain": "http://localhost:8081", "weight": 1 },
    { "domain": "http://localhost:8082", "weight": 1 },
    { "domain": "http://localhost:8083", "weight": 1 }
  ],
  "be_retries": 3,
  "be_retry_delay": 200,
  "be_ping_path": "/ping",
  "be_ping_retries": 3,
  "be_ping_retry_delay": 500,
  "health_check_interval": 30000,
  "send_alert_webhook": "https://webhook.site/your-webhook",
  "alert_on_be_failure_streak": 3,
  "alert_on_all_be_failure_streak": 3,
  "enableSelfHealing": true,
  "_test_only_chances_of_healing_server": 0.5
}
```

- **lbPORT**: The port on which the load balancer runs.
- **_lbAlgo**: Load balancing algorithm (values: `rand`, `rr`, `wrr`).
- **be_servers**: Array of backend server configurations.
- **be_retries**: Number of retry attempts for a failed request.
- **be_ping_path**: Health check endpoint path for backend servers.
- **health_check_interval**: Time interval for performing health checks.
- **send_alert_webhook**: Webhook URL for sending alerts.
- **enableSelfHealing**: Flag to enable or disable self-healing.
- **_test_only_chances_of_healing_server**: Self-healing randomness (0 disables randomness, 1 makes healing unlikely).

## Results
<img width="1919" height="848" alt="file_2025-05-18_21 30 37" src="https://github.com/user-attachments/assets/890148f7-d497-4826-80b3-14d97b687d9c" />
<img width="1919" height="858" alt="file_2025-05-18_21 31 13" src="https://github.com/user-attachments/assets/8e3581a2-8cc3-409e-bbd9-48c18926bbbc" />
<img width="1480" height="640" alt="file_2025-05-18_21 31 35" src="https://github.com/user-attachments/assets/cd7b9374-a09a-4a2f-b1da-4ad756eaa951" />
<img width="1048" height="292" alt="file_2025-05-18_21 32 49" src="https://github.com/user-attachments/assets/59bd72f4-c83e-46d8-92af-9b8ce4221b79" />
<img width="1299" height="266" alt="file_2025-05-18_21 33 12" src="https://github.com/user-attachments/assets/77f11c4b-649c-40cc-94c3-e3568d2eeab4" />
<img width="1418" height="221" alt="file_2025-05-18_21 34 07" src="https://github.com/user-attachments/assets/dbadc80d-e7cc-4c37-afc6-0b54a643c2f4" />

## License

This project is licensed under the MIT License.

## References
> This project demonstrates the basic functionality of a load balancer, inspired by [Crafting-Own-Load-Balancer-with-Advanced-Features](https://github.com/Zuyuf/Crafting-Own-Load-Balancer-with-Advanced-Features). It replicates features seen in popular load balancers such as NGINX, HAProxy, Azure Gateway, and AWS ELB.
