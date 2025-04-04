# Use the official PHP 8.3 image with Apache as the base image
FROM php:8.4-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies and PHP extensions as needed
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Composer (using the official Composer image as a source)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Install BunJS
RUN curl -fsSL https://bun.sh/install | bash

# Ensure Bun is in the PATH for subsequent commands
ENV PATH="/root/.bun/bin:${PATH}"

# Install PHP extensions for MariaDB connection
RUN docker-php-ext-install pdo pdo_mysql

# Copy your project files into the container
COPY . /var/www/html

# After copying your project files, set proper permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Install PHP dependencies with Composer
RUN composer install --no-dev --optimize-autoloader

# Install JavaScript dependencies using Bun
RUN bun install

# Build your React assets (adjust the build command as needed)
RUN bun run build

# Optimize Laravel caches (config, routes, views, etc.)
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Enable mod_rewrite for Laravel's .htaccess support
RUN a2enmod rewrite

# Configure Apache to use Laravel's public directory and listen on port 4000
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf && \
    sed -i 's/80/4000/g' /etc/apache2/ports.conf && \
    sed -i 's/:80/:4000/g' /etc/apache2/sites-available/000-default.conf

# Add Directory directive to allow .htaccess overrides in the public directory
RUN echo '<Directory /var/www/html/public>\n    Options Indexes FollowSymLinks\n    AllowOverride All\n    Require all granted\n</Directory>' \
    > /etc/apache2/conf-available/laravel.conf && \
    a2enconf laravel.conf

# Expose port 4000 for Apache
EXPOSE 4000

# Start Apache in the foreground
CMD ["apache2-foreground"]

