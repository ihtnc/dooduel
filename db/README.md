# Dooduel Supabase scripts

This directory contains all the scripts and configurations necessary to set up and manage the Supabase backend for the Dooduel application.

## Directory structure

Scripts are grouped into their respective directories and are prefixed with numbers to indicate the recommended execution order.

| Directory        | File prefix | Description                                     |
|------------------|-------------|-------------------------------------------------|
| `/schema`        | `0XX`       | For creating the required db schemas            |
| `/extensions`    | `0XX`       | For enabling the required db extensions         |
| `/types`         | `0XX`       | For creating the custom types used              |
| `/policies`      | `0XX`       | For enabling policies on realtime tables        |
| `/tables`        | `1XX`       | For creating the required db tables             |
| `/functions`     | `2XX`       | For creating the required db functions          |
| `/triggers`      | `3XX`       | For creating the required db triggers on tables |
| `/publications`  | `4XX`       | For creating the required publications          |
| `/cron`          | `8XX`       | For creating the required cron jobs             |
| `/seed`          | `9XX`       | For seeding the initial data into the db tables |

> [!NOTE]
> Seed data (names and words) can be safely modified by changing the values in the files located in the `/seed` directory.
