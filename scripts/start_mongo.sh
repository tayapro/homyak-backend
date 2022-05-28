echo "starting MongoDB...."
docker run --rm -d \
    -p 27017:27017 \
    --net homyak.net \
    --name mongo \
    -e MONGO_INITDB_ROOT_USERNAME="sti" \
    -e MONGO_INITDB_ROOT_PASSWORD="boss" \
    -v C:/dev/js-tutorial/homyak.social-backend/db_data:/data/db \
    mongo:4.4

# run in EC2
#   docker run --rm -d \
#   --net homyak.net \
#   --name mongo \
#   -e MONGO_INITDB_ROOT_USERNAME="stipaxa" \
#   -e MONGO_INITDB_ROOT_PASSWORD="boss" \
#   -v /home/ec2-user/db_data:/data/db \
#   mongo:4.4

#docker run -d -p 3000:3000 \
#	--name homyak-backend \
# 	-e MONGO_URL="mongodb+srv://Stipaxa:dAhDIyylpU2j0TxLGvBi@homyak.quto1.mongodb.net/?retryWrites=true&w=majority" \
#	sti80/homyaksocial-backend:003