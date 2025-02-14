module.exports = {
  apps: [
    {
      name: "backend",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      // Advanced Logging
      error_file: "logs/err.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time: true,
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Performance Optimization
      node_args: [
        "--max-old-space-size=4096",
        "--optimize-for-size",
        "--max-semi-space-size=64",
        "--max-old-space-size=4096",
        "--gc-interval=100",
      ],

      // Cluster Management
      instances: "max",
      instance_var: "INSTANCE_ID",
      exec_mode: "cluster",

      // Reliability
      max_restarts: 10,
      min_uptime: "5s",
      listen_timeout: 10000,
      kill_timeout: 5000,
      wait_ready: true,

      // Monitoring
      deep_monitoring: true,
      monitor_interval: 30000,

      // Load Balancing
      increment_var: "PORT",

      // Graceful Shutdown
      shutdown_with_message: true,

      // Source Maps
      source_map_support: true,

      // Error Recovery
      autorestart: true,
      max_memory_restart: "2G",
      restart_delay: 4000,

      // Process Management
      treekill: false,
      kill_timeout: 8000,

      // Resource Management
      max_memory_restart: "2G",

      // Environment
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
        NODE_OPTIONS: "--max-old-space-size=4096",
      },
    },
  ],
}
