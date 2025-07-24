| Service             | Responsibility                             |
| ------------------- | ------------------------------------------ |
| **Auth Service**    | Login, Register, JWT Tokens                |
| **User Service**    | Profile, Addresses, User-specific settings |
| **Product Service** | Product CRUD, categories, filters          |
| **Cart Service**    | Add/Remove/View cart                       |
| **Order Service**   | Checkout, payments, order tracking         |
| **Upload Service**  | Image uploads (Cloudinary)                 |
| **API Gateway**     | Entry point, route forwarding, auth        |

e-commerce/
├── api-gateway/
├── auth-service/
├── user-service/
├── product-service/
├── cart-service/
├── order-service/
├── upload-service/
├── docker-compose.yml
├── .env.template
├── README.md
