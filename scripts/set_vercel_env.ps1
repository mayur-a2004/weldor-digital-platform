# Set all environment variables for Vercel production
$envVars = @{
    "MONGODB_URI" = "mongodb+srv://weldoradmin:Weldor2026@cluster0.g4wl0mi.mongodb.net/weldor_industrial?retryWrites=true&w=majority"
    "CLOUDINARY_CLOUD_NAME" = "ptiq7p8r"
    "CLOUDINARY_API_KEY" = "312621411738839"
    "CLOUDINARY_API_SECRET" = "Zu-q2czVP-0ANJrK_150CY6MKng"
    "CLOUDINARY_URL" = "cloudinary://312621411738839:Zu-q2czVP-0ANJrK_150CY6MKng@ptiq7p8r"
    "ADMIN_EMAIL" = "admin@weldorindustries.com"
    "ADMIN_INITIAL_PASSWORD" = "Weldor@2026"
    "NODE_ENV" = "production"
}

foreach ($key in $envVars.Keys) {
    $val = $envVars[$key]
    Write-Host "Adding $key..."
    echo $val | npx vercel env add $key production --yes 2>&1
    Start-Sleep -Seconds 1
}

Write-Host "All environment variables added! Redeploying..."
npx vercel --prod --yes 2>&1
