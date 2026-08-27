# DARSHANAI Temple Crowd Dataset

## Overview
This dataset contains 8,760 hourly observations (365 full days) of temple crowd metrics, environmental variables, gate operations, staff allocation, queue dynamics, waiting times, and incident reports.

## Columns & Definitions

| Column Name | Type | Description |
|---|---|---|
| `id` | Integer | Unique record ID |
| `date` | String | ISO Date (`YYYY-MM-DD`) |
| `hour` | Integer | Hour of day (0-23) |
| `day_of_week` | Integer | Day of week (0=Mon, 6=Sun) |
| `day_name` | String | Full day name (Monday...Sunday) |
| `month` | Integer | Month of year (1-12) |
| `is_weekend` | Integer | Binary flag for weekend (0 or 1) |
| `is_holiday` | Integer | Binary flag for public/festival holiday |
| `is_festival` | Integer | Binary flag for major religious festival |
| `festival_type` | String | Name of festival if applicable |
| `special_event` | Integer | Binary flag for special pooja/vip event |
| `weather` | String | Weather condition (Clear, Cloudy, Light Rain, Heavy Rain) |
| `temperature` | Float | Ambient temperature (°C) |
| `rainfall` | Float | Hourly rainfall (mm) |
| `previous_hour_visitors` | Integer | Visitor count in previous hour |
| `previous_day_visitors` | Integer | Total visitors recorded previous day |
| `entry_rate` | Integer | Pilgrims entering per hour |
| `exit_rate` | Integer | Pilgrims exiting per hour |
| `queue_length` | Integer | Total active queue length (persons) |
| `number_of_open_gates` | Integer | Active entry/exit gate count |
| `staff_available` | Integer | Active security/volunteers on duty |
| `average_service_time` | Float | Average time per pilgrim at sanctum (minutes) |
| `waiting_time` | Float | Estimated queue waiting time (minutes) |
| `visitor_count` | Integer | **Target (Regression)** Total visitors present in temple premises |
| `crowd_level` | String | **Target (Classification)** LOW, MODERATE, HIGH, CRITICAL |
| `risk_level` | String | **Target (Classification)** LOW, MEDIUM, HIGH, CRITICAL |
| `incident_count` | Integer | Safety/crowd incidents logged |
