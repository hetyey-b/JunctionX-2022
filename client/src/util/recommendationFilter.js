export const recommendationFilter = (recommendations, onlyCityCenter) => {
    let originCity = {};
    
    const colors = recommendations.map((recommendation) => {
        if (!recommendation.data || Object.keys(recommendation.data).length === 0) {
            originCity = {...recommendation};
            return {...recommendation, color: '#00b9ff', greenSum: 0, yellowSum: 0};
        }

        let greenSum = 0;
        let yellowSum = 0;

        // accommodation
        if (onlyCityCenter) {
            greenSum += recommendation.data.accommodation[1].mean;
            yellowSum += recommendation.data.accommodation[1].low;
        } else {
            greenSum += Math.min(recommendation.data.accommodation[0].mean, recommendation.data.accommodation[1].mean);
            yellowSum += Math.min(recommendation.data.accommodation[0].low, recommendation.data.accommodation[1].low);
        }

        // outings
        greenSum += recommendation.data.outings[1].mean;
        yellowSum += recommendation.data.outings[0].mean;

        // travel
        greenSum += Math.min(...recommendation.data.travel.map(option => option.mean));
        yellowSum += Math.min(...recommendation.data.travel.map(option => option.low));

        if (recommendation.budget.budget >= greenSum) {
            return {...recommendation, color: '#44EE70', greenSum: greenSum, yellowSum: yellowSum};

        } else if (recommendation.budget.budget >= yellowSum) {
            return {...recommendation, color: '#ffb619', greenSum: greenSum, yellowSum: yellowSum};
        } else {
            return {...recommendation, color: '#de3c4b', greenSum: greenSum, yellowSum: yellowSum};
        }
    });

    return {colors: colors, originCity};
}

