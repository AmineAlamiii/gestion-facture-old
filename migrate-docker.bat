@echo off
REM Script pour executer les migrations Prisma dans Docker (Windows)

echo 🚀 Execution de la migration Prisma dans Docker...

REM Verifier si le conteneur backend est en cours d'execution
docker ps -q -f name=gestion-facture-backend >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Le conteneur backend n'est pas en cours d'execution.
    echo 📦 Demarrage des conteneurs...
    docker-compose up -d
    echo ⏳ Attente du demarrage des services (15 secondes)...
    timeout /t 15 /nobreak >nul
)

echo 📊 Generation du client Prisma...
docker exec gestion-facture-backend npx prisma generate

echo 🔄 Execution de la migration...
docker exec gestion-facture-backend npx prisma migrate dev --name add_payment_method

echo ✅ Migration terminee!
echo.
echo 📋 Pour voir les tables de la base de donnees:
echo    docker exec gestion-facture-backend npx prisma studio
echo.
echo 🔄 Pour redemarrer le backend:
echo    docker-compose restart backend

pause

