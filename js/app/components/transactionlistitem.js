define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types'
],

function (React, createReactClass, PureRenderMixin, PropTypes) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'TransactionListItem',

    propTypes: {
      data: PropTypes.object.isRequired,
      handleDetailsClick: PropTypes.func.isRequired
    },

    formatData: function (data) {
      var round = function (amount) {
        return Math.round(amount * 100) / 100;
      };

      var result = {
        title: data.description
      };

      var paymentsList = [];
      data.participants.forEach(function (participant) {
        if (participant.amount) {
          paymentsList.push(participant);
        }
      });
      paymentsList.sort(function (a, b) {
        if (a.amount > b.amount || a.amount === b.amount && a.participant.toLowerCase() < b.participant.toLowerCase()) {
          return -1;
        }
        return 1;
      });

      var payments = '';
      var total = 0;
      paymentsList.forEach(function (payment, idx) {
        idx && (payments += ', ');
        payments += payment.participant + ': ' + round(payment.amount);
        total += payment.amount;
      });
      result.payments = payments;
      result.total = round(total);

      var participantsList = data.participants.map(function (participant) {
        return participant.participant;
      });
      participantsList.sort(function (a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      });

      var participants = '';
      participantsList.forEach(function (participant) {
        for (var i = 0, l = paymentsList.length; i < l; ++i) {
          if (paymentsList[i].participant === participant) {
            return;
          }
        }
        participants += ', ' + participant;
      });
      result.participants = participants;

      return result;
    },

    handleClick: function () {
      this.props.handleDetailsClick(this.props.data);
    },

    render: function () {
      var data = this.formatData(this.props.data);

      return (
        el('div', {className: 'transaction', onClick: this.handleClick},
          el('table', null,
            el('tbody', null,
              el('tr', null,
                el('td', {className: 'title'},
                  data.title,
                  el('div', {className: 'payments'},
                    data.payments,
                    data.participants
                  )
                ),
                el('td', {className: 'total'},
                  data.total
                )
              )
            )
          )
        )
      );
    }

  });

});
