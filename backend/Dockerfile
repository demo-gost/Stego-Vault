# Use a lightweight Linux image with GCC installed
FROM gcc:latest

# Set the working directory inside the container
WORKDIR /app

# Copy your backend files into the container
COPY . .

# Compile the C++ code (using C++17)
RUN g++ main.cpp -o stego_server -lws2_32 -std=c++17

# Expose the port your server runs on
EXPOSE 8080

# Command to run the server
CMD ["./stego_server"]