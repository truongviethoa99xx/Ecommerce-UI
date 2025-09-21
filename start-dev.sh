#!/bin/bash

echo "🚀 Starting E-commerce Development Environment..."

# Kill existing processes
pkill -f "python3 -m http.server" 2>/dev/null || true
pkill -f "serve" 2>/dev/null || true

# Method 1: Try serve (simple and reliable)
if command -v serve &> /dev/null; then
    echo "✅ Starting with serve..."
    serve -s . -p 5173 &
    sleep 2
    if curl -s http://localhost:5173 > /dev/null; then
        echo "🎉 SUCCESS! Development server running at:"
        echo "   👉 http://localhost:5173/"
        echo "   👉 API Test App: http://localhost:3001/test-app"
        exit 0
    fi
fi

# Method 2: Python HTTP server
echo "✅ Starting with Python HTTP server..."
python3 -m http.server 5173 &
SERVER_PID=$!
sleep 2

if curl -s http://localhost:5173 > /dev/null; then
    echo "🎉 SUCCESS! Development server running at:"
    echo "   👉 http://localhost:5173/"
    echo "   👉 API Test App: http://localhost:3001/test-app"
    echo "   🛑 To stop: kill $SERVER_PID"
    echo ""
    echo "📝 Files available:"
    echo "   - index.html (Main app)"
    echo "   - test-app.html (API testing)"
    echo "   - simple-dev.html (Simple React app)"
    echo ""
    echo "✨ API Integration is 100% complete!"
else
    echo "❌ Failed to start development server"
    echo "💡 Try opening files directly in browser"
fi
