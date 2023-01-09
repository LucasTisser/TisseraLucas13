# Desafío 

## Loggers, Gzip y análisis de performance.

### Consignas

Incorporar al proyecto de servidor de trabajo la compresión gzip.

Verificar sobre la ruta /info con y sin compresión, la diferencia de cantidad de bytes devueltos en un caso y otro.

Luego implementar loggueo (con alguna librería vista en clase) que registre lo siguiente:

   - Ruta y método de todas las peticiones recibidas por el servidor (info)
   - Ruta y método de las peticiones a rutas inexistentes en el servidor (warning)

Errores lanzados por las apis de mensajes y productos, únicamente (error)
Considerar el siguiente criterio:
  - Loggear todos los niveles a consola (info, warning y error)
  - Registrar sólo los logs de warning a un archivo llamada warn.log
  - Enviar sólo los logs de error a un archivo llamada error.log

----

Luego, realizar el análisis completo de performance del servidor con el que venimos trabajando.

Vamos a trabajar sobre la ruta '/info', en modo fork, agregando ó extrayendo un console.log de la información colectada antes de devolverla al cliente. Además desactivaremos el child_process de la ruta '/randoms'

Para ambas condiciones (con o sin console.log) en la ruta '/info' OBTENER:

  - El perfilamiento del servidor, realizando el test con --prof de node.js. Analizar los resultados obtenidos luego de procesarlos con --prof-process. 
  - Utilizaremos como test de carga Artillery en línea de comandos, emulando 50 conexiones concurrentes con 20 request por cada una. Extraer un reporte con los resultados en archivo de texto.

----

Luego utilizaremos Autocannon en línea de comandos, emulando 100 conexiones concurrentes realizadas en un tiempo de 20 segundos. Extraer un reporte con los resultados (puede ser un print screen de la consola)

  - El perfilamiento del servidor con el modo inspector de node.js --inspect. Revisar el tiempo de los procesos menos performantes sobre el archivo fuente de inspección.
  - El diagrama de flama con 0x, emulando la carga con Autocannon con los mismos parámetros anteriores.
  
Realizar un informe en formato pdf sobre las pruebas realizadas incluyendo los resultados de todos los test (texto e imágenes). 

👉 Al final incluir la conclusión obtenida a partir del análisis de los datos.



### Conclusion

Sin concole log 

```console

╰─>$ node benchmark.js
Running tests
Running 20s test @ http://localhost:8080/test/info
100 connections

┌─────────┬───────┬────────┬────────┬────────┬───────────┬──────────┬────────┐     
│ Stat    │ 2.5%  │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │     
├─────────┼───────┼────────┼────────┼────────┼───────────┼──────────┼────────┤     
│ Latency │ 87 ms │ 110 ms │ 221 ms │ 226 ms │ 126.25 ms │ 38.64 ms │ 263 ms │     
└─────────┴───────┴────────┴────────┴────────┴───────────┴──────────┴────────┘     
┌───────────┬────────┬────────┬────────┬────────┬────────┬─────────┬────────┐      
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min    │      
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤      
│ Req/Sec   │ 600    │ 600    │ 800    │ 900    │ 790    │ 81.93   │ 600    │      
├───────────┼────────┼────────┼────────┼────────┼────────┼─────────┼────────┤      
│ Bytes/Sec │ 274 kB │ 274 kB │ 367 kB │ 412 kB │ 362 kB │ 37.6 kB │ 274 kB │      
└───────────┴────────┴────────┴────────┴────────┴────────┴─────────┴────────┘      

Req/Bytes counts sampled once per second.
# of samples: 20

16k requests in 20.15s, 7.24 MB read

```

El resultado de Artillery nos indica(ver archivo para mas detalle)


```console

http.response_time:
  min: ......................................................................... 5
  max: ......................................................................... 135
  median: ...................................................................... 47.9
  p95: ......................................................................... 94.6
  p99: ......................................................................... 104.6

```


Benchmark con console Log


```console

╰─>$node benchmark.js
Running tests (CON CONSOLE LOG)
Running 20s test @ http://localhost:8080/test/info
100 connections


┌─────────┬────────┬────────┬────────┬────────┬───────────┬──────────┬────────┐    
│ Stat    │ 2.5%   │ 50%    │ 97.5%  │ 99%    │ Avg       │ Stdev    │ Max    │    
├─────────┼────────┼────────┼────────┼────────┼───────────┼──────────┼────────┤    
│ Latency │ 462 ms │ 565 ms │ 643 ms │ 649 ms │ 556.56 ms │ 56.91 ms │ 672 ms │    
└─────────┴────────┴────────┴────────┴────────┴───────────┴──────────┴────────┘    
┌───────────┬─────────┬─────────┬─────────┬───────┬─────────┬─────────┬─────────┐  
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5% │ Avg     │ Stdev   │ Min     │  
├───────────┼─────────┼─────────┼─────────┼───────┼─────────┼─────────┼─────────┤  
│ Req/Sec   │ 145     │ 145     │ 183     │ 205   │ 178.5   │ 15.5    │ 145     │  
├───────────┼─────────┼─────────┼─────────┼───────┼─────────┼─────────┼─────────┤  
│ Bytes/Sec │ 66.3 kB │ 66.3 kB │ 83.8 kB │ 94 kB │ 81.7 kB │ 7.13 kB │ 66.3 kB │  
└───────────┴─────────┴─────────┴─────────┴───────┴─────────┴─────────┴─────────┘  

Req/Bytes counts sampled once per second.
# of samples: 20

4k requests in 20.15s, 1.63 MB read

```

El resultado de Artillery nos indica (ver archivo para mas detalle)

```console

http.response_time:
  min: ......................................................................... 7
  max: ......................................................................... 512
  median: ...................................................................... 210.6
  p95: ......................................................................... 368.8
  p99: ......................................................................... 478.3

```


Las pruebas indican que en el caso que logeamos por consola la respuesta antes de enviarla, el tiempo de respuesta es mayor y que en el mismo tiempo, se manejan menos request.
