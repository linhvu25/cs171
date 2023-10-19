// DATASETS

// Global variable with 1198 pizza deliveries
// console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);

displayChange();
function displayChange() {

    //// GET USER INPUT
    // get selected area
    let selectBoxArea = document.getElementById("area");
    let selectedValueArea = selectBoxArea.options[selectBoxArea.selectedIndex].value;

    // get selected order type
    let selectBoxOrder = document.getElementById("order-type");
    let selectedValueOrder = selectBoxOrder.options[selectBoxOrder.selectedIndex].value;

    //// FILTER DATA
    let filtered_delivery_df = getDeliveryData(selectedValueArea, selectedValueOrder);
    let relevant_ID = getID(filtered_delivery_df);
    let filtered_feedback_df = getFeedbackData(relevant_ID);

    // DISPLAY SUMMARY OF DATA & BAR CHART
    document.getElementById('summary').innerHTML = createSummary(filtered_delivery_df, filtered_feedback_df);
    renderBarChart(filtered_delivery_df);
}


// function to filter for relevant deliveryData
function getDeliveryData(area, order_type) {

    // initialize
    let delivery_df = deliveryData;

    console.log("area", area)
    // filter based on user input
    if (area !== "All") {
        if (order_type !== "All") {
            delivery_df = deliveryData.filter( item => item.area === area && item.order_type === order_type);
        } else delivery_df = deliveryData.filter( item => item.area === area)
    } else if (order_type !== "All") {
        delivery_df = deliveryData.filter( (item) => item.order_type === order_type)
    }
    console.log("filtered delivery data", delivery_df);

    // return
    return delivery_df;
}

// function to get relevant IDs
function getID (data) {

    // initialize array of IDs
    let relevantID = [];

    // loop through delivery data to get relevant IDs
    data.forEach(function(item) {
            relevantID.push(item.delivery_id);
    })
    console.log("id", relevantID);
    // return
    return relevantID;
}

// function to filter for relevant feedback data based on user input
function getFeedbackData(relevant_ID) {

    // initialize
    let id = relevant_ID;
    let index = [];

    // get an array of indices of relevant orders in feedbackData
    relevant_ID.forEach( function(id){
        index.push(feedbackData.findIndex( (feedback) => feedback.delivery_id === id));
    })

    // initialize
    let filtered_feedbackData = [];

    // get relevant feedbackData
    index.forEach( function(item) {
        filtered_feedbackData.push(feedbackData[item]);
    })

    filtered_feedbackData = filtered_feedbackData.filter((item) => item !== undefined);

    console.log("filtered feedback", filtered_feedbackData);
    // return
    return filtered_feedbackData;
}

function createSummary(filtered_delivery_df, filtered_feedback_df) {

    let summaryData = {
        "delivery_num": filtered_delivery_df.length,
        "pizzas_delivered": filtered_delivery_df.reduce( (n, {count}) => n + count, 0),
        "avg_delivery_time": Math.round(filtered_delivery_df.reduce( (n, {delivery_time}) => n + delivery_time, 0) / filtered_delivery_df.length),
        "total_sales": Math.round(filtered_delivery_df.reduce( (n, {price}) => n + price, 0 )),
        "feedback_all": filtered_feedback_df.length,
        "feedback_cat": {
            "low": filtered_feedback_df.filter( (item) => item.quality === 'low').length,
            "medium": filtered_feedback_df.filter( (item) => item.quality === 'medium').length,
            "high": filtered_feedback_df.filter( (item) => item.quality === 'high').length
        }
    }

    return "Number of pizza deliveries: " + summaryData.delivery_num + "<br>" +
            "Number of all delivered pizzas: " + summaryData.pizzas_delivered + "<br>" +
            "Average delivery time (min): " + summaryData.avg_delivery_time + "<br>" +
            "Total sales (USD): " + summaryData.total_sales + "<br>" +
            "Number of all feedback entries: " + summaryData.feedback_all + "<br>" +
            "Number of low quality feedback: " + summaryData.feedback_cat.low + "<br>" +
            "Number of medium quality feedback: " + summaryData.feedback_cat.medium + "<br>" +
            "Number of high quality feedback: " + summaryData.feedback_cat.high + "<br>";
}
