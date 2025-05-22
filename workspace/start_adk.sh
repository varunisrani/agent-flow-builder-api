# Function to check if port is listening
check_port() {
    # Try ss command first (usually available by default)
    if command -v ss &> /dev/null; then
        ss -tuln | grep -q ":8000"
        return $?
    fi
    
    # Try lsof as fallback
    if command -v lsof &> /dev/null; then
        lsof -i :8000 > /dev/null 2>&1
        return $?
    fi
    
    # Try curl as last resort
    if command -v curl &> /dev/null; then
        curl -s http://localhost:8000 > /dev/null 2>&1
        return $?
    fi
    
    # If no tools available, check process and logs
    if [ -f adk_web.pid ]; then
        pid=$(cat adk_web.pid)
        if kill -0 $pid 2>/dev/null; then
            if ! grep -i "error" adk_web.log &>/dev/null; then
                return 0
            fi
        fi
    fi
    
    return 1
}

# Wait for server to start
echo "Waiting for ADK web server to start..."
for i in {1..30}; do
    if check_port; then
        echo "ADK web server started successfully"
        cat adk_web.log
        exit 0
    fi
    sleep 1
done

echo "Failed to start ADK web server"
cat adk_web.log
exit 1 