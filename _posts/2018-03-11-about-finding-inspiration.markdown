---
layout: post
location: Stockholm
title: About Finding Inspiration
date: 2018-03-11 12:12
---
Lately I have wondered about one's search for meaning and how frequent this
thought is to people in general. Where do I find meaning? I do not suffer
thinking that I will be able to figure that out today, tomorrow, or any time
soon. However I do think writing this post will give me the illusion of purpose.
At least for a short while. And maybe it will help others.

A week back I was browsing code handling paid subscriptions. The main logic for
handling user subscription statuses is modelled with a finite state machine. Say
what you will about state machines, but they look pretty in Ruby. The state
machine was modelled using a gem called `workflow`. Workflow is an old gem, some
would probably be quick to call it dead. The only reasonable thing to do for a
person is, of course, to change the dependency to a well maintained gem. Enter
`AASM`.

```ruby
class Subscription < ApplicationRecord
  include AASM

  aasm column: :status do
    state :new, initial: true
    state :trialing
    state :active
    state :cancelled

    events :start_trial do
      transitons from: :new, to: :trialing
    end
    events :cancel do
      transitons from: %i[trialing active], to: :cancelled
    end
    events :activate do
      transitons from: %i[trialing cancelled], to: :active
    end

    after_all_transitions :log_subscription_transition
  end
end
```

Thinking about transitions, there are multiple considerations that have to be
accounted for. To me personally *readability* is the most important one.

For the past, maybe, 2 months I have been struggling reading my colleagues code.
I am not sure if that is indicative to my current mental health situation, or if
the quality of work has gone down drastically in general.

Apologies for the digression. Moving on to investigating how the state machine
can be utilized in this context.

```ruby
subscription = Subscription.new
subscription.start_trial!
subscription.activate!
```

The bang (`!`) suffix tells AASM to persist the state to whatever persistence
store connected (in this case ActiveRecord).

This blog post started out as the ramblings of a lonely developer one Sunday
morning. Instead of working at my issues, I started writing word after word,
building sentence after sentence. Not unlike the word suggestions on a modern
smartphone keyboard I formed sentences that made no sense. From that cloud of
incoherent muck rose this (hopefully informative) post.

## Alternative Titles for This Post

- Workflow is Dead, Long Live AASM
- Update Dependency, Gain Eternal Love From Colleagues
