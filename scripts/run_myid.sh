#MONGODB_URL=$(cat ../.env | grep ^MONGO_URL | awk -F= '{print $2}')
MONGODB_URL="mongodb+srv://Stipaxa:dAhDIyylpU2j0TxLGvBi@homyak.quto1.mongodb.net/?retryWrites=true&w=majority"
echo $MONGODB_URL
docker run -d \
    --name myid \
    -p 3001:3001 \
    -e MONGODB_URL="$MONGODB_URL" \
    dsimakov/myid:0.1.0