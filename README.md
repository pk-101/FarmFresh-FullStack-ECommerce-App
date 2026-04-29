# FarmFresh – Full Stack E-Commerce Web Application

## Overview

FarmFresh is a production-style full stack e-commerce platform built for local farm-to-home delivery businesses.  
Customers can browse products, manage cart, place orders, and track order history.  
Admins can manage inventory, products, and orders through role-based access.

## Key Highlights

- Full Stack Application using .NET + React
- Clean Architecture backend
- JWT Authentication + Role Based Authorization
- SQL Server relational database
- Cart & Order Management
- Inventory Control
- Professional UI with responsive frontend

## Tech Stack

### Backend
- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server
- JWT Authentication
- Clean Architecture

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios
- Context API

## Features

### Customer Features
- Register / Login
- Browse Products
- Add to Cart
- Quantity Management
- Place Order
- Premium Order History UI

### Admin Features
- Role Based Login
- Add / Edit Products
- Inventory Management
- Order Monitoring

## Architecture

Frontend (React)
↓
REST API (.NET Core)
↓
Service Layer
↓
EF Core
↓
SQL Server

## Security

- JWT Token Authentication
- Role Based Authorization
- Protected Routes
- Secure API Access

## Folder Structure

/backend   -> ASP.NET Core API  
/frontend  -> React UI

## How to Run Locally

### Backend

```bash
cd backend
dotnet restore
dotnet run
