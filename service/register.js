'use strict';

module.exports.handler = async event => {
  console.log('event', JSON.stringify(event));

  // 1. Validate params
  if (!event.body) {
    console.error('Specify  params');
    return event;
  }

  const body = JSON.parse(event.body);
  const email = body.email;
  const jobId = body.jobId;

  if (typeof email !== 'string' || typeof jobId !== 'string') {
    console.error('Specify email and jobid parameters');
    return event;
  }
};
