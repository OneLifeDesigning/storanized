function intCharts() {
  const mountChart = (chart, dataApi) => {
    const labels = []
    const data = []
    const listBgColors = []
    
    dataApi.forEach(element => {
      labels.push(element.category)
      data.push(element.count)
    });
    
    const dynamicColor = () => {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };
    
    for (let index = 0; index < data.length; index++) {
      listBgColors.push(dynamicColor()) 
    }

    const ctx = chart.getContext('2d');
    const config = {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          label: 'Best Categories',
          data: data,
          backgroundColor: listBgColors
        }]
      }
    };
    const myChart = new Chart(ctx, config)
  }
  const chartCategoriesProducts = document.getElementById('chartCategoriesProducts')
  if (chartCategoriesProducts) {
    axios({
      method: 'GET',
      url: '/api/products/category'
    })
    .then(response => {
      mountChart(chartCategoriesProducts, response.data)
    })
    .catch()
  }
}