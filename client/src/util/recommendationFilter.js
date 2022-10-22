export const recommendationFilter = (recommendations, onlyCityCenter) => {
    const colors = recommendations.map((recommendation) => {
        if (!recommendation.data || Object.keys(recommendation.data).length === 0) {
            return {...recommendation, color: 'blue', greenSum: 0, yellowSum: 0};
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
            return {...recommendation, color: 'green', greenSum: greenSum, yellowSum: yellowSum};

        } else if (recommendation.budget.budget >= yellowSum) {
            return {...recommendation, color: 'yellow', greenSum: greenSum, yellowSum: yellowSum};
        } else {
            return {...recommendation, color: 'red', greenSum: greenSum, yellowSum: yellowSum};
        }
    });

    return colors;
}

