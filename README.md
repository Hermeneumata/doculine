# Doculine

This project is a Next.js application that allows users to manage documents within different projects in a timeline format. The application is deployed on Azure Web Services as a web app and uses SQL Server on Azure for data storage.

## Main Features

### Projects

Projects are represented by the Timeline type. Each project has a name and a resource path, which indicates where the project's files are stored. A project can contain multiple documents. A user creating a project automatically becomes the project owner and only they can delete the project. The project owner can also delete any document within the project.

### Documents

Documents are represented by the Document type. A document belongs to a project and has a creator. Documents can be created by dragging and dropping files into a designated drop zone. The name of the file, and in the case of .msg files, the date and description are automatically populated based on the information retrieved from the file metadata. A document can be deleted by its creator or the owner of the project it belongs to.

### User Management

The application supports multiple users. A user cannot delete documents created by another user unless they are the owner of the project the document belongs to.

## Getting Started

To start the development server, use one of the following commands:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The application will be available at `http://localhost:3000`.

### Deployment

The application is deployed on Azure Web Services as a web app. The database is SQL Server hosted on Azure.

## Environment Configuration

The application uses environment variables for configuration. These variables should be defined in a .env file, which is ignored by Git. Here are the necessary environment variables:

- `NEXTAUTH_SECRET`: This is a secret used by NextAuth for encryption. It is recommended to be a random string of 32 characters.

- `NEXTAUTH_URL`: This is the base URL of your NextAuth configuration. On localhost, it should be set to "http://localhost:3000/api/auth". On production, it should be the URL of your app with "/api/auth" appended.

- `AZURE_TENANT_ID`: This is the directory (tenant) ID of your Azure AD.

- `AZURE_SSO_CLIENT_ID`: This is the Application (client) ID of your Azure AD app registration.

- `AZURE_SSO_CLIENT_SECRET`: This is the client secret of your Azure AD app registration.

- `DATABASE_URL`: This is the connection string to the SQL Server database.

- `SHADOW_DATABASE_URL`: This is the connection string to the shadow database.

Remember to replace the placeholders with your actual values. After setting up the environment variables, you can start the application.

## User Management and Authentication

The application uses Azure Active Directory (Azure AD) for user management and authentication. To configure Azure AD, you need to add the following environment variables to the .env file:

- `AZURE_TENANT_ID`: This is the directory (tenant) ID of your Azure AD. You can find it in the Azure portal.

- `AZURE_SSO_CLIENT_ID`: This is the Application (client) ID of your Azure AD app registration. You can find it in the Azure portal in your app registration settings.

- `AZURE_SSO_CLIENT_SECRET`: This is the client secret of your Azure AD app registration. You can generate it in the Azure portal in your app registration settings.

These variables are used to authenticate the application with Azure AD and enable Single Sign-On (SSO).

For a user to have access to the application, they must be a member of the Azure AD identified by the `AZURE_TENANT_ID`. When a user tries to access the application, they will be redirected to the Azure AD sign-in page where they can authenticate with their Azure AD credentials. After successful authentication, the user will be redirected back to the application.

## Database

The application uses Prisma as the ORM and SQL Server hosted on Azure as the database. To configure the database, you need to add DATABASE_URL and SHADOW_DATABASE_URL to the environment variables in the .env file.

- DATABASE_URL: This is the connection string to the SQL Server database.

- SHADOW_DATABASE_URL: This is the connection string to the shadow database. The shadow database is a copy of your production database schema which Prisma uses to generate and test the SQL migration scripts. It should be in the same format as DATABASE_URL.

## Continuous Integration and Deployment (CI/CD)

The project uses GitHub Actions for continuous integration and deployment. The workflow is defined in the .github/workflows/azure-webapps-node.yml file.

When a pull request is merged into the main branch, the workflow is triggered. The steps of the workflow are as follows:

1. The project is built using the npm run build command.

2. The Prisma migrations are run using the `npx prisma migrate deploy` command. This applies any new migrations to the database.

3. The application is deployed to the Azure Web App.

This setup ensures that the application is automatically built, and deployed whenever changes are merged into the main branch.

### Further Information

For more information about Next.js, refer to the [https://nextjs.org/docs](Next.js Documentation) and the [https://github.com/vercel/next.js/](Next.js GitHub repository).
