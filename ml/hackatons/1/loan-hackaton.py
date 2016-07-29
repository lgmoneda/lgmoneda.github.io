import csv
import statistics
import numpy as np 
with open("train_u6lujuX_final2.csv", "rb") as csvfile:
	data_reader = csv.reader(csvfile, delimiter=',', quotechar='"')
	
	#Header contains feature names
	row = data_reader.next()
	#feature_names = np.array(row[1:-1])
	feature_names = row[1:-1]
	original_feature_names = feature_names[:]

	#Load dataset, and target classes
	train_X, train_y = [], []
	for row in data_reader:
		if len(row) > 0:
			train_X.append(row[1:-1])
			train_y.append(row[11]) 
	train_X = np.array(train_X)
	train_y = np.array(train_y)

print "number of instances: ", len(train_X)
print "instance example: ", train_X[26]
print "target from this instance: ", train_y[26]
print "features names: ", feature_names

with open("test_Y3wMUE5_final2.csv", "rb") as csvfile:
	data_reader = csv.reader(csvfile, delimiter=',', quotechar='"')
	
	row = data_reader.next()
	#Load dataset, and target classes
	subm_X, subm_id = [], []
	for row in data_reader:
		if len(row) > 0:
			subm_X.append(row[1:])
			subm_id.append(row[0])
	subm_X = np.array(subm_X)


#Adicionei 9 credit history como categorical
categorical_columns = [0, 1, 2, 3, 4, 5, 6, 9]	

#Dealing with missing values
#print "gender: "
for column in categorical_columns:
	print statistics.mode(train_X[:, column])

	for instance in train_X:
		if instance[column] == "":
			instance[column] = statistics.mode(train_X[:, column])

	for instance in subm_X:
		if instance[column] == "":
			instance[column] = statistics.mode(subm_X[:, column])


for i in range(len(feature_names)):
	if i not in categorical_columns:
		for instance in train_X:
			if instance[i] == "":
				instance[i] = -1
		for instance in subm_X:
			if instance[i] == "":
				instance[i] = -1

#Lets transform the categorical classes with One hot encoding
#Get rid of the ? later...
from sklearn.preprocessing import LabelEncoder, OneHotEncoder


for column in categorical_columns:
	enc = LabelEncoder()
	label_encoder = enc.fit(train_X[:, column])
	#print "Categorial classes: ", label_encoder.classes_
	integer_classes = label_encoder.transform(label_encoder.classes_).reshape(len(label_encoder.classes_), 1)
	enc = OneHotEncoder()
	ohe = enc.fit(integer_classes)

	num_of_rows = train_X.shape[0]
	t = label_encoder.transform(train_X[:, column]).reshape(num_of_rows, 1)
	new_features = ohe.transform(t)
	train_X = np.concatenate([train_X, new_features.toarray()], axis=1)
	
	for new_feat in label_encoder.classes_:
		feature_names.append(new_feat)


for column in categorical_columns:
	enc = LabelEncoder()
	label_encoder = enc.fit(subm_X[:, column])
	#print "Categorial classes: ", label_encoder.classes_
	integer_classes = label_encoder.transform(label_encoder.classes_).reshape(len(label_encoder.classes_), 1)
	enc = OneHotEncoder()
	ohe = enc.fit(integer_classes)

	num_of_rows = subm_X.shape[0]
	t = label_encoder.transform(subm_X[:, column]).reshape(num_of_rows, 1)
	new_features = ohe.transform(t)
	subm_X = np.concatenate([subm_X, new_features.toarray()], axis=1)

for column in categorical_columns:
	feature_names.remove(original_feature_names[column])

#deleting the old categorical columns
train_X = np.delete(train_X, [categorical_columns], 1)
subm_X = np.delete(subm_X, [categorical_columns], 1)

enc = LabelEncoder()
label_encoder = enc.fit(train_y)
t = label_encoder.transform(train_y)
train_y = t
print feature_names
print train_X[26]

train_y = train_y.astype(float)
train_X = train_X.astype(float)
subm_X = subm_X.astype(float)

for i in range(len(feature_names)):
	if i not in categorical_columns:
		for instance in train_X:
			if instance[i] == "-1":
				instance[i] = statistics.mean(train_X[:, i])
		for instance in subm_X:
			if instance[i] == "-1":
				instance[i] = statistics.mean(subm_X[:, i])


from sklearn.cross_validation import train_test_split
X_train, X_test, y_train, y_test = train_test_split(train_X, train_y, test_size=0.25, random_state=33)

from sklearn import tree
clf = tree.DecisionTreeClassifier(criterion="entropy",
	max_depth=3, min_samples_leaf=5)
clf = clf.fit(X_train, y_train)

from sklearn import metrics
def measure_performance(X, y, clf, show_accuracy=True,
	show_classification_report=True, show_confussion_matrix=True):
	y_pred = clf.predict(X)
	if show_accuracy:
		print "Accuracy: {0:.3f}".format(
			metrics.accuracy_score(y, y_pred)), "\n" 

	if show_classification_report:
		print "Classification Report"
		print metrics.classification_report(y, y_pred), "\n"

	if show_confussion_matrix:
		print "Confusion Matrix"
		print metrics.confusion_matrix(y, y_pred), "\n"

	return metrics.accuracy_score(y, y_pred)


#Tree Visualization
import pydot,StringIO
doc_data = StringIO.StringIO()
tree.export_graphviz(clf, out_file=doc_data,
	feature_names = feature_names)
graph = pydot.graph_from_dot_data(doc_data.getvalue())
graph.write_png("adult.png")
from IPython.core.display import Image
Image(filename="adult.png")

print "Training Random Forest"
#Trying random forest
from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(n_estimators = 1000, min_samples_leaf = 1, min_samples_split = 18)
clf_rand = model.fit(X_train, y_train)
#clf_rand = model.fit(train_X, train_y)
#predict_rand = model.predict(X_test)

print "Feature / Importance"
for i in range(len(model.feature_importances_)):
	print "%s => %f" % (feature_names[i], model.feature_importances_[i])

#print model.feature_importances_
#print predict_rand

from sklearn.ensemble import AdaBoostClassifier
from sklearn.ensemble import GradientBoostingClassifier

#ada_clf = AdaBoostClassifier(RandomForestClassifier(criterion="gini" ,n_estimators = 1000, min_samples_leaf=1, 
#	min_samples_split=1, max_depth=None), n_estimators=180, learning_rate=1)
ada_clf = AdaBoostClassifier(RandomForestClassifier(n_estimators = 1000, min_samples_leaf= 1, min_samples_split=1), 
n_estimators=160, learning_rate=1)
ada_clf = ada_clf.fit(X_train, y_train)
#ada_clf = ada_clf.fit(train_X, train_y)

gb_clf = GradientBoostingClassifier(n_estimators=1000, min_samples_leaf= 1, learning_rate=1, min_samples_split=18)
gb_clf = gb_clf.fit(X_train, y_train)
#gb_clf = gb_clf.fit(train_X, train_y)

#Applying decision trees clf to submission
# 3 5
clf = tree.DecisionTreeClassifier(criterion="entropy",
	max_depth=1, min_samples_leaf=1)
clf = clf.fit(train_X, train_y)

y = ada_clf.predict(subm_X)
y = y.astype(str)
for i in range(len(y)):
	if y[i] == "1.0":
		y[i] = "Y"
	else:
		y[i] = "N"

with open('submission.csv', 'wb') as csvfile:
    spamwriter = csv.writer(csvfile,
                            quoting=csv.QUOTE_MINIMAL)
    msg = ""
    spamwriter.writerow([str('Loan_ID,Loan_Status')])
    for i in range(len(y)):
    	msg = str(subm_id[i]), str(y[i])
    	print msg
    	spamwriter.writerow([str(subm_id[i]), str(y[i])])

great_acc = 0
great_i, great_j = 0, 0

#Grid Search
'''
for i in range(1,20):
	for j in range(1,20):
		clf = RandomForestClassifier(n_estimators = 1000, min_samples_leaf= i, min_samples_split=j)
		#clf = tree.DecisionTreeClassifier(criterion="entropy",
		#	max_depth=i, min_samples_leaf=j)
		clf = clf.fit(X_train, y_train)
		print "Accuracy for %d and %d" % (i, j)
		new_acc = measure_performance(X_test, y_test, clf, True, True, True)
		if new_acc > great_acc:
			great_acc = new_acc
			great_i, great_j = i, j
print great_acc
print great_i, great_j
'''

#ada_clf = AdaBoostClassifier(tree.DecisionTreeClassifier(criterion="entropy", 
#	max_depth=2, min_samples_leaf=1), 
#n_estimators=150, learning_rate=1)


from sklearn.cross_validation import cross_val_score, LeaveOneOut, KFold
from scipy.stats import sem

def loo_cv(X_train, y_train,clf):
	loo = LeaveOneOut(X_train[:].shape[0])
	scores = np.zeros(X_train[:].shape[0])
	for train_index, test_index in loo:

		X_train_cv, X_test_cv = X_train[train_index], X_train[test_index]
	
		y_train_cv, y_test_cv = y_train[train_index], y_train[test_index]

		clf = clf.fit(X_train_cv,y_train_cv)

		y_pred = clf.predict(X_test_cv)

		scores[test_index] = metrics.accuracy_score(y_test_cv.astype(int), y_pred.astype(int))
	print ("Mean score: {0:.3f} (+/-{1:.3f})").format(np.mean(scores), sem(scores))


#loo_cv(train_X, train_y, ada_clf)

def evaluate_cross_validation(clf, X, y, K):
	cv = KFold(len(y), K, shuffle=True, random_state=0)
	# by default the score used is the one returned by score >>>
	scores = cross_val_score(clf, X, y, cv=cv)
	print scores
	print ("Mean score: {0:.3f} (+/-{1:.3f})").format(np.mean(scores), sem(scores))
	return np.mean(scores)

#evaluate_cross_validation(ada_clf, train_X, train_y, 5)
#print measure_performance(X_test, y_test, ada_clf, True, True, True)

print "Decision trees"
print measure_performance(X_test, y_test, clf, False, False, False)
print "Rand trees: "
print measure_performance(X_test, y_test, clf_rand, False, False, False)
evaluate_cross_validation(clf_rand, X_test, y_test, 10)
print "Ada boost classifier: "
print measure_performance(X_test, y_test, ada_clf, False, False, False)
evaluate_cross_validation(ada_clf, X_test, y_test, 5)
print "Gradient boost "
print measure_performance(X_test, y_test, gb_clf, False, False, False)


#Grid Search
'''
for i in range(1,5):
	for j in range(1,5):
		clf = AdaBoostClassifier(RandomForestClassifier(n_estimators = 1000, min_samples_leaf= i, min_samples_split=j), 
n_estimators=160, learning_rate=1)
		#clf = clf.fit(X_train, y_train)
		clf = clf.fit(train_X, train_y)
		print "Accuracy for %d and %d" % (i, j)
		#new_acc = measure_performance(X_test, y_test, clf, True, True, True)
		new_acc = evaluate_cross_validation(ada_clf, train_X, train_y, 5)
		print new_acc
		if new_acc > great_acc:
			great_acc = new_acc
			great_i, great_j = i, j
print "Ada best: "
print great_acc
print great_i, great_j
'''