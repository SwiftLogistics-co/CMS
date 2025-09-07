# CMS API Documentation

This documentation explains how to set up and use the CMS API with XML requests and JWT authentication.

---

## Table of Contents

1. [Installation](#installation)
2. [Authentication](#authentication)
    - [Login (POST)](#login-post)
    - [Get Logged-in User Profile (GET)](#get-logged-in-user-profile-get)
3. [Orders API](#orders-api)
    - [Get Orders (GET)](#get-orders-get)
    - [Create Order (POST)](#create-order-post)
4. [Frontend Examples](#frontend-examples)
    - [Login Example](#login-example)
    - [Fetch Orders Example](#fetch-orders-example)
    - [Create Order Example](#create-order-example)

---

## Installation

Install the required packages:

```bash
npm install express body-parser @supabase/supabase-js xmlbuilder
npm install express-session
npm install express-xml-bodyparser
npm install jsonwebtoken
