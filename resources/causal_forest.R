library(grf)
data_train = read.csv("~/repos/causality/experiments/causal-forest/train.csv", stringsAsFactors=F)
data_test = read.csv("~/repos/causality/experiments/causal-forest/test.csv", stringsAsFactors=F)

W = data_train[, c("private_school")]
X = data_train[, c("video_game",
                   "income",
                   "nerd")]

Y = data_train[, "grade"]
X.test = data_test[, c("video_game",
                       "income",
                       "nerd")]

tau.forest = causal_forest(X, 
                           Y,
                           W,
                           num.trees = 100)

tau.hat = predict(tau.forest, X.test)
tau.hat["predictions"]

# Estimate the conditional average treatment effect on the full sample (CATE).
average_treatment_effect(tau.forest, target.sample = "all")
average_treatment_effect(tau.forest, target.sample = "treated")

write.csv(tau.hat["predictions"], "~/repos/causality/experiments/causal-forest/causal_forest_predictions.csv")
