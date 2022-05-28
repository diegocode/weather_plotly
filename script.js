url = 'https://api.open-meteo.com/v1/forecast?latitude=-34.64&longitude=-60.48&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,windspeed_10m&current_weather=true&timezone=America%2FSao_Paulo'

function plot(temp, wind, timemarks) {
  var tempGraph = {
    x: timemarks,
    y: temp,
    mode: 'lines+markers',
    type: 'scatter',
    name: 'temperature',    
    marker: { size: 10 },
    line: {
      color: 'rgb(200, 0, 0)',
      width: 1
    }
  };

  var windGraph = {
    x: timemarks,
    y: wind,
    mode: 'lines+markers',
    type: 'scatter',
    name: 'wind speed',   
    marker: { size: 10 },
    line: {
      color: 'green',
      width: 1
    }
  };

  var data = [tempGraph , windGraph];

  var layout = {
    title: 'Temp & Wind Speed',
    yaxis: {title: 'temp °C - wind (Km/h)'},
    xaxis: {range: [ '2022-05-28', '2022-05-29' ]}
  };

  var config = {responsive: true}
  
  Plotly.newPlot('pronostico', data, layout, config);
}

function procesar(datos) {
  datos_json = JSON.parse(datos)
  
  temp = datos_json['hourly']['temperature_2m']
  windsp = datos_json['hourly']['windspeed_10m']
  timemarks = datos_json['hourly']['time']  
  
  for(var i=0; i < timemarks.length; i++) {
     timemarks[i] = timemarks[i].replace('T', ' ')
  }
  
  plot(temp, windsp, timemarks)

  document.getElementById('ahora').innerHTML = 
    datos_json['current_weather']['time'].replace('T', ' ') + '<br>' + 
    datos_json['current_weather']['temperature'] + '°C<br>' + 
    datos_json['current_weather']['windspeed'] + 'Km/h<br>' + 
    datos_json['current_weather']['winddirection'] + '°<br>'

}


fetch(url).then(response => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.text();

}).then(texto => {  
  procesar(texto)
}).catch(err => console.error(`Fetch problem: ${err.message}`));

