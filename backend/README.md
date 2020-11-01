# Sounds of Prague
## Backend app documentation

### Data sources
#### IPR
##### Technical usage of area
https://www.geoportalpraha.cz/cs/data/otevrena-data/0A7F12C6-2FE9-432A-8A59-A1975CAD91B6





### Test request
#### Test invalid
```
curl -X GET http://localhost:8080/
curl -X POST -d '{"test":"hello"}' http://localhost:8080/
```

#### Test valid
```
curl -X POST -d '{"longitude":"14.3225442", "latitude":"50.0926567"}' http://localhost:8080/
```