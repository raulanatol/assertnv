#!/usr/bin/env node
import { checkIfLastVersion, executeAction } from './main';
import { processArguments } from './prompt';

checkIfLastVersion();

const action = processArguments(process.argv[2]);
executeAction(action);
