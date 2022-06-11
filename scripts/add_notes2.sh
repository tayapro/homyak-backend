ADDRESS=http://localhost:3000
#TOKEN=$1
curl -isS -H "Content-Type: application/json; charset=utf-8" -H "Authorization: Bearer $TOKEN" -X POST $ADDRESS/notes -d '{"author": "bomjara","title": "20220605_Guide for Homyak usage","text": "Read instructiosn...","tags": ["Homyak","Kolbasa"]}'
echo ''
echo '============================='
curl -isS -H "Content-Type: application/json; charset=utf-8" -H "Authorization: Bearer $TOKEN" -X POST $ADDRESS/notes -d '{"author": "stipaxa","title": "20220605_How to cook Borsch","text": "Just cook it..."}'
echo ''
echo '============================='
curl -isS -H "Content-Type: application/json; charset=utf-8" -H "Authorization: Bearer $TOKEN" -X POST $ADDRESS/notes -d '{"author": "katchka","title": "20220605_How to build Pax","text": "Just buy a set of good scrudrivers...","tags": []}'
echo ''
echo '============================='
